/**
 * Module 1: Traffic Light & Autonomous Car - Module Definition
 */
(function() {
  if (!window.Argon || !window.Argon.registerModule) {
    console.error("Argon ModuleRegistry must be loaded before modules.");
    return;
  }

  Argon.registerModule({
    id: "traffic-light",
    title: "?? Traffic Light & Autonomous Car",
    description: "Learn Python conditional logic, memory variables, and comparison operators to safely pilot an autonomous vehicle through smart city roads.",
    competencies: Argon.TRAFFIC_LIGHT_COMPETENCIES,
    lessons: Argon.TRAFFIC_LIGHT_LESSONS
  });
})();
