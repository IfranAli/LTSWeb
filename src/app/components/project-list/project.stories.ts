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
import {TaskState} from "../../models/task";
import {TaskComponent} from "../task/task.component";
import {ProjectListComponent} from "./project-list.component";
import {MatCardModule} from "@angular/material/card";
import {MatList, MatListModule} from "@angular/material/list";

export default {
  component: ProjectListComponent,
  title: 'Project List',
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      declarations: [
        TaskComponent
      ],
      imports: [
        CommonModule,
        MatIconModule,
        MatSliderModule,
        MatButtonModule,
        FormsModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatCheckboxModule,
        MatCardModule,
        MatListModule
      ],
    }),
  ]
} as Meta;

export const actionsData = {
  // onPinTask: action('onPinTask'),
  // onArchiveTask: action('onArchiveTask'),
};

const Template: Story = args => ({
  props: {
    ...args,
    // onPinTask: actionsData.onPinTask,
    // onArchiveTask: actionsData.onArchiveTask,
  },
});

export const Default = Template.bind({});
Default.args = {
  // tasks: TaskMockData
};
