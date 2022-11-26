import {EntityState} from "@ngrx/entity";
import {ProjectModel} from "../models/project.model";

export interface AppState extends EntityState<ProjectModel>{
}
