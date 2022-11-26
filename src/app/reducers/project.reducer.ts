import {createFeatureSelector, createReducer, on} from '@ngrx/store';
import {projectAdapter, ProjectModel} from "../models/project.model";
import {createProject, deleteProject, loadProjects, updateProject} from "../actions/project.actions";
import {AppState} from "../state/AppState";

const defaultProject = {
  ids: [],
  entities: {}
}

export const initialProjectState = projectAdapter.getInitialState(defaultProject);

export const selectProjectState = createFeatureSelector<AppState>('projectReducer');

export const {
  selectIds,
  selectEntities
} = projectAdapter.getSelectors(selectProjectState);

export const projectReducer = createReducer(
  initialProjectState,
  on(loadProjects, (state, payload) => {
    return projectAdapter.addMany(payload.entities, state);
  }),
  on(createProject, (state, payload: Partial<ProjectModel>) => {
    const project: ProjectModel = {
      id: payload.id ?? 0,
      title: payload.title ?? '',
      description: payload.description ?? '',
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
