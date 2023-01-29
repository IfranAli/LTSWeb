import {IdentityInterface} from "./Identity.interface";
import {TaskModel} from "./task.model";
import {createEntityAdapter} from "@ngrx/entity";

export interface ProjectModelPublic {
  title: string;
  description: string;
  colour: string;
  code: string;
  enabled: boolean;
}

export interface ProjectDatabaseModel extends ProjectModelPublic, IdentityInterface {
}

export interface ProjectModel extends ProjectDatabaseModel {
  tasks: TaskModel[];
}

export interface ProjectDatabaseModels {
  entities: ProjectModel[];
}

export const defaultProject: ProjectModel = {
  tasks: [],
  id: 0,
  title: '',
  description: '',
  colour: '#A0A0D0',
  code: '',
  enabled: true,
}

export const projectAdapter = createEntityAdapter<ProjectModel>();

export class Project implements ProjectModel {
  id: number = 0;
  title: string = '';
  description: string = '';
  code: string = '';
  enabled: boolean = true;
  colour: string = '#D2D2D2';
  public tasks: TaskModel[] = [];

  /**
   * Returns the length of tasks in this project.
   */
  public length() {
    return this.tasks.length;
  }

  public addTask(task: TaskModel): void {
    task.projectId = this.id;
    this.tasks.push(task);
  }
}

export function createProjectModel(
  model: Partial<ProjectModel> = {},
  defaultVar: ProjectModel = defaultProject
): ProjectModel {
  return {
    id: model.id ?? defaultVar.id,
    title: model.title ?? defaultVar.title,
    description: model.description ?? defaultVar.description,
    colour: model.colour ?? defaultVar.colour,
    code: model.code ?? defaultVar.code,
    enabled: model.enabled ?? defaultVar.enabled,
    tasks: [],
  }
}

export function generateCode(title: string): string {
  const ignore: string[] = ['A', 'E', 'I', 'O', 'U'];
  const limit = 3;
  let projectCode = '';

  if (title.length > limit) {
    projectCode = title.split('').reduce((acc: string, char: string) => {
      const letter: string = char.toUpperCase();
      const isLetter: boolean = (letter !== char.toLowerCase());
      const isUppercase: boolean = isLetter && (char == char.toUpperCase());

      if (isLetter && (isUppercase || !ignore.includes(letter))) {
        return acc.concat(letter);
      }

      return acc;
    })

    projectCode = (projectCode.length > limit) ? projectCode.substring(0, limit) : projectCode;
  }

  return (projectCode.length > limit) ? title.substring(0, limit).toUpperCase() : projectCode;
}
