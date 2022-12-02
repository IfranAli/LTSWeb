import {createFeatureSelector, createReducer, on} from '@ngrx/store';
import {projectAdapter, ProjectModel} from "../models/project.model";
import {createProject, deleteProject, loadProjects, updateProject} from "../actions/project.actions";

export interface ProjectsState {
  ids: [],
  entities: {}
}

const defaultProject: ProjectsState = {
  entities: {},
  ids: []
}

const initialProjectState = projectAdapter.getInitialState(defaultProject);
export const selectProjectState = createFeatureSelector<ProjectsState>('projects');

export const {
  selectIds,
  selectEntities
} = projectAdapter.getSelectors(selectProjectState);

export const projectsReducer = createReducer(
  initialProjectState,
  on(loadProjects, (state, payload) => {
    return projectAdapter.addMany(payload.entities, state);
  }),
  on(createProject, (state, payload: Partial<ProjectModel>) => {
    const project: ProjectModel = {
      id: payload.id ?? 0,
      title: payload.title ?? '',
      description: payload.description ?? '',
      colour: payload.colour ?? '',
      tasks: []
    }
    return projectAdapter.addOne(project, state)
  }),
  on(updateProject, (state) => {
    return state;
  }),
  on(deleteProject, (state) => {
    return state;
  }),
);
