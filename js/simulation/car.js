/**
 * Argon - Smart Car Animation & Motion Controller
 * Controls car drive animations, LiDAR scanning pulses, brake lights, and headlights.
 */
window.Argon = window.Argon || {};

async function animateCarAction(actionName) {
      const car = $("#car");
      const bubble = $("#bubble");
      const mult = getSimSpeedMultiplier();
      const STOP_POS = "calc(44% - 102px)";
      const END_POS = "calc(100% + 24px)";

      car.classList.remove("preview-rev", "scanning", "lights-on", "braking", "crawling");

      if (actionName === "stop") {
        car.classList.add("braking");
        $("#stopLine").classList.add("active-stop");
        bubble.textContent = "🛑 Braking at Stop Line!";
        car.style.transition = `left ${(1.05 * mult).toFixed(2)}s cubic-bezier(.2,.8,.2,1)`;
        car.style.left = STOP_POS;
        await sleep(1250);
      } else if (actionName === "slow") {
        car.classList.add("braking");
        bubble.textContent = "🟡 Slowing down gently… then stopping";
        car.style.transition = `left ${(2.2 * mult).toFixed(2)}s cubic-bezier(.1,.6,.3,1)`;
        car.style.left = STOP_POS;
        await sleep(2400);
      } else if (actionName === "crawl") {
        car.classList.add("crawling", "lights-on");
        bubble.textContent = "🐢 Crawling forward carefully";
        car.style.transition = `left ${(3.2 * mult).toFixed(2)}s linear`;
        car.style.left = END_POS;
        await sleep(3400);
      } else {
        car.classList.add("lights-on");
        bubble.textContent = "🟢 Driving forward!";
        car.style.transition = `left ${(1.35 * mult).toFixed(2)}s ease-in`;
        car.style.left = END_POS;
        await sleep(1500);
      }
      bubble.textContent = "";
    }

function resetCarPosition() {
      const car = $("#car");
      car.style.transition = "none";
      car.style.left = "18px";
      $("#stopLine").classList.remove("active-stop");
      void car.offsetWidth;
    }

Argon.animateCarAction = animateCarAction;
Argon.resetCarPosition = resetCarPosition;
