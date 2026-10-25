/**
 * DARKNESS: THE HAUNTED WORLD
 * Level 1 Objective Tracker & Quest Progression
 */

export class ObjectiveManager {
  constructor(onObjectiveChange) {
    this.onObjectiveChange = onObjectiveChange;
    this.currentStep = 1;
    this.totalSteps = 4;
    this.isCompleted = false;

    this.steps = {
      1: {
        title: "Find Generator Key",
        desc: "Search the Doctor's Office to locate the missing Generator Key."
      },
      2: {
        title: "Unlock Electrical Substation",
        desc: "Head down the north corridor and unlock the heavy iron substation door."
      },
      3: {
        title: "Activate Main Power",
        desc: "Pull the high-voltage breaker switch on the generator to restore emergency power."
      },
      4: {
        title: "ESCAPE THE HOSPITAL",
        desc: "The Surgeon has awakened! Run to the Main Security Exit Gate and escape!"
      }
    };
  }

  reset() {
    this.currentStep = 1;
    this.isCompleted = false;
    this.notify();
  }

  getCurrentObjective() {
    return this.steps[this.currentStep] || { title: "Survive", desc: "Escape the darkness." };
  }

  advanceTo(stepNumber) {
    if (stepNumber > this.currentStep) {
      this.currentStep = stepNumber;
      if (this.currentStep > this.totalSteps) {
        this.isCompleted = true;
      }
      this.notify();
    }
  }

  notify() {
    if (typeof this.onObjectiveChange === 'function') {
      this.onObjectiveChange(this.getCurrentObjective(), this.currentStep);
    }
  }
}
