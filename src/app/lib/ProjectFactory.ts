import {Project} from "../models/project.model";
import {IdentitySingleton} from "./IdentitySingleton";

export class ProjectFactory {
  constructor(
    private identity: IdentitySingleton
  ) {

  }

  public newProject(): Project {
    return new Project(this.identity);
  }
}
