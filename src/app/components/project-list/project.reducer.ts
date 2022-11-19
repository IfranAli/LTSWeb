import {createReducer, on} from '@ngrx/store';
import {ProjectDatabaseModels, ProjectModel} from "../../models/project.model";
import {createProject, deleteProject, loadProjects, updateProject} from "./project.actions";

export interface AppState {
  projects: ProjectState;
}

export interface ProjectState {
  projects: ProjectModel[];
}

export const initialState: ProjectState = {
  projects: []
}

export const projectReducer = createReducer(
  initialState,
  on(loadProjects, (state, payload: ProjectDatabaseModels) => {
    let projects: ProjectModel[] = payload.entities.map(databaseModel => ({
      ID: databaseModel.ID,
      Title: databaseModel.Title,
      Description: databaseModel.Description,
      tasks: []
    }));

    return {
      ...state,
      projects: [
        ...state.projects,
        ...projects
      ]
    };
  }),
  on(createProject, (state, payload) => {
    return {
      ...state,
      projects: [
        ...state.projects, {
          ID: 0,
          Title: payload.Title,
          Description: payload.Description,
          tasks: []
        }
      ]
    };
  }),
  on(updateProject, (state) => {
    return state;
  }),
  on(deleteProject, (state) => {
    return state;
  })
);
