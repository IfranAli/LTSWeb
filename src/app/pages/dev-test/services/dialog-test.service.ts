import {
  ApplicationRef,
  computed,
  effect,
  inject,
  ViewContainerRef,
} from "@angular/core";

export class DialogTestService {
  private applicationRef = inject(ApplicationRef);

  rootContainerRef = computed(() => {
    const rootComponents = this.applicationRef.components;

    if (rootComponents.length) {
      return rootComponents[0].injector.get(ViewContainerRef);
    }

    return null;
  });

  constructor() {
    effect(() => {
      if (this.applicationRef) {
        console.debug("ApplicationRef", this.applicationRef);
      }
    });
  }

  public getRootViewContainer = () => {
    const rootComponents = this.applicationRef.components;

    if (rootComponents.length) {
      console.debug("Root Components", rootComponents[0]);
      return rootComponents[0].instance.vcr;
    }
  };
}
