import {generateCode, Project} from "../src/app/models/project.model";

describe('Project Tests', () => {

  it('should make project code from title', () => {
    expect(generateCode("LTScheduler")).toBe('LTS');
    expect(generateCode("Programming Projects")).toBe('PRG');
    expect(generateCode("Personal")).toBe('PRS');
  });
})
