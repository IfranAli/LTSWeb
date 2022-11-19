import {createAction, props} from "@ngrx/store";
import {ProjectDatabaseModels, ProjectModelPublic} from "../../models/project.model";
import {IdentityInterface} from "../../models/Identity.interface";

export const createProject = createAction(
  'Create project action', props<ProjectModelPublic>()
);

export const updateProject = createAction(
  'Update project action', props<ProjectModelPublic>()
);

export const deleteProject = createAction(
  'Delete project action', props<IdentityInterface>()
);

export const loadProjects = createAction(
  'Load project action', props<ProjectDatabaseModels>()
);
