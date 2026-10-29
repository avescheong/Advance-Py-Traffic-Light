/**
 * Argon - Smart Car Animation & Motion Controller
 * Controls car drive animations, LiDAR scanning pulses, brake lights, and headlights.
 * Extensible: dispatches to custom action handlers registered in ActionRegistry.
 */
window.Argon = window.Argon || {};

(function() {
  const STOP_POS = 158;
  const END_POS = 460;

  async function animateCarAction(actionName) {
    const car = $("#car");
    const bubble = $("#bubble");
    const stopLine = $("#stopLine");
    if (!car) return;

    // Check for custom action animation handler
    const actionDef = Argon.getAction ? Argon.getAction(actionName) : null;
    if (actionDef && typeof actionDef.handler === "function") {
      return await actionDef.handler({
        car,
        bubble,
        stopLine,
        actionName,
        sleep,
        getSimSpeedMultiplier
      });
    }

    const mult = getSimSpeedMultiplier();
    car.classList.remove("driving", "braking", "crawling");

    if (actionName === "stop") {
      if (stopLine) stopLine.classList.add("active-stop");
      car.classList.add("braking");
      car.style.transition = `left ${0.5 * mult}s cubic-bezier(.25,1,.5,1)`;
      car.style.left = STOP_POS + "px";
      if (bubble) bubble.textContent = "?? STOPPED!";
      await sleep(650);
      car.classList.remove("braking");
      if (stopLine) stopLine.classList.remove("active-stop");
    } else if (actionName === "slow") {
      if (stopLine) stopLine.classList.add("active-stop");
      car.classList.add("braking");
      car.style.transition = `left ${0.9 * mult}s ease-out`;
      car.style.left = STOP_POS + "px";
      if (bubble) bubble.textContent = "?? SLOWING DOWN...";
      await sleep(1000);
      car.classList.remove("braking");
      if (stopLine) stopLine.classList.remove("active-stop");
    } else if (actionName === "crawl") {
      car.classList.add("crawling");
      car.style.transition = `left ${1.5 * mult}s linear`;
      car.style.left = END_POS + "px";
      if (bubble) bubble.textContent = "?? CRAWLING SAFELY...";
      await sleep(1550);
      car.classList.remove("crawling");
    } else {
      // Default driving action ("go" or any custom cruising action)
      car.classList.add("driving");
      car.style.transition = `left ${0.75 * mult}s cubic-bezier(.4,0,.2,1)`;
      car.style.left = END_POS + "px";
      const icon = Argon.getActionIcon ? Argon.getActionIcon(actionName) : "??";
      if (bubble) bubble.textContent = `${icon} ${actionName.toUpperCase()}!`;
      await sleep(850);
      car.classList.remove("driving");
    }
  }

  function resetCarPosition() {
    const car = $("#car");
    if (!car) return;
    car.classList.remove("driving", "braking", "crawling", "scanning");
    car.style.transition = "none";
    car.style.left = "8px";
    const stopLine = $("#stopLine");
    if (stopLine) stopLine.classList.remove("active-stop");
  }

  Argon.animateCarAction = animateCarAction;
  Argon.resetCarPosition = resetCarPosition;
  window.animateCarAction = animateCarAction;
  window.resetCarPosition = resetCarPosition;
})();
