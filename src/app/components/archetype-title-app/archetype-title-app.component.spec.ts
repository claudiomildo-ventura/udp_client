import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchetypeTitleAppComponent } from './archetype-title-app.component';

describe('ArchetypeTitleAppComponent', () => {
  let component: ArchetypeTitleAppComponent;
  let fixture: ComponentFixture<ArchetypeTitleAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchetypeTitleAppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchetypeTitleAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
