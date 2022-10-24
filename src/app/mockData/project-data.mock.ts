import {Project} from "../models/project.model";
import {IdentitySingleton} from "../lib/IdentitySingleton";
import {TaskFactory} from "../lib/TaskFactory";
import {ProjectFactory} from "../lib/ProjectFactory";

export function ProjectDataMock(): Project[] {
  let identityProvider = IdentitySingleton.getInstance();
  let projectFactory = new ProjectFactory(identityProvider);

  let personalProject = projectFactory.newProject();
  personalProject.title = 'Personal Projects';
  personalProject.addSimpleTask('Drink Tea');
  personalProject.addSimpleTask('Sprint Planning');

  let misc = projectFactory.newProject();
  misc.title = 'Misc';
  misc.addSimpleTask('Go to the gym');
  misc.addSimpleTask('Order groceries');
  misc.addSimpleTask('Wonder when the project will be done');

  let workProject = projectFactory.newProject();
  workProject.title = 'Work';
  workProject.addSimpleTask('Make coffee');
  workProject.addSimpleTask('BAU');
  workProject.addSimpleTask('Code Review');

  return [personalProject, workProject, misc];
}
