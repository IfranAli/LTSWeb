import {ProjectService} from "../src/app/project.service";
import {TestBed} from "@angular/core/testing";
import {HttpClient} from "@angular/common/http";
import {HttpClientTestingModule} from "@angular/common/http/testing";

// todo: tests don't work
describe('Project API endpoint tests', () => {
  let httpClient: HttpClient;
  let projectService: ProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectService]
    });

    httpClient = TestBed.inject(HttpClient);
    projectService = TestBed.inject(ProjectService);
  })

  test('GET /projects', (done) => {
    // let results = await firstValueFrom(projectService.getProjects());
    let r = projectService.getProjects().toPromise().then(value => {
      console.log(value)
      done();
    })
  })
})
