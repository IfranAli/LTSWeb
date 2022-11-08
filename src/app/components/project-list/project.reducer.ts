import {createReducer, on} from '@ngrx/store';
import {ProjectModel} from "../../models/project.model";
import {createProject, deleteProject, loadProjects, updateProject} from "./project.actions";

export interface AppState {
  projects: ProjectState;
}

export interface ProjectState{
  projects: ProjectModel[];
}

export const initialState: ProjectState = {
  projects: []
}

export const projectReducer = createReducer(
  initialState,
  on(loadProjects, state => ({...state})),
  on(createProject, (state) => {
    return {
      ...state,
      projects: [
        ...state.projects, {
          id: 0, title: 'New Project', tasks: []
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
