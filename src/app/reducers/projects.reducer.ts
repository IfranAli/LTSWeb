import {createFeatureSelector, createReducer, on} from '@ngrx/store';
import {createProjectModel, projectAdapter, ProjectModel} from "../models/project.model";
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
    return projectAdapter.addOne({...createProjectModel(payload)}, state)
  }),
  on(updateProject, (state, payload) => {
    return projectAdapter.updateOne({
      changes: {
        ...createProjectModel(payload),
      },
      id: payload.id,
    }, state);
  }),
  on(deleteProject, (state, payload) => {
    return projectAdapter.removeOne(payload.id, state)
  }),
);
