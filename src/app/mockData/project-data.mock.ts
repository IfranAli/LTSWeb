import {Project} from "../models/project.model";
import {IdentitySingleton} from "../lib/IdentitySingleton";
import {ProjectFactory} from "../lib/ProjectFactory";

export function ProjectDataMock(): Project[] {
  let identityProvider = IdentitySingleton.getInstance();
  let projectFactory = new ProjectFactory(identityProvider);

  let personalProject = projectFactory.newProject();
  personalProject.Title = 'Personal Projects';
  personalProject.addSimpleTask('Drink Tea');
  personalProject.addSimpleTask('Sprint Planning');

  let misc = projectFactory.newProject();
  misc.Title = 'Misc';
  misc.addSimpleTask('Go to the gym');
  misc.addSimpleTask('Order groceries');
  misc.addSimpleTask('Wonder when the project will be done');

  let workProject = projectFactory.newProject();
  workProject.Title = 'Work';
  workProject.addSimpleTask('Make coffee');
  workProject.addSimpleTask('BAU');
  workProject.addSimpleTask('Code Review');

  return [personalProject, workProject, misc];
}
