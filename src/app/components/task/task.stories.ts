import {TaskComponent} from "./task.component";
import {Meta, moduleMetadata, Story} from "@storybook/angular";
import {action} from "@storybook/addon-actions";
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatSliderModule} from "@angular/material/slider";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {TaskState} from "../../models/task.model";
import {TaskMockData} from "../../mockData/task-data.mock";

export default {
  component: TaskComponent,
  title: 'Task',
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        MatIconModule,
        MatSliderModule,
        MatButtonModule,
        FormsModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatCheckboxModule
      ],
    }),
  ]
} as Meta;

export const actionsData = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

const Template: Story = args => ({
  props: {
    ...args,
    onPinTask: actionsData.onPinTask,
    onArchiveTask: actionsData.onArchiveTask,
  },
});

export const Default = Template.bind({});
Default.args = {
  task: {
    ...TaskMockData[0],
  }
};

export const Pinned = Template.bind({});
Pinned.args = {
  task: {
    ...TaskMockData[0],
    isPinned: true
  }
};

export const Archived = Template.bind({});
Archived.args = {
  task: {
    ...Default.args['task'],
    state: TaskState.DONE
  },
};
