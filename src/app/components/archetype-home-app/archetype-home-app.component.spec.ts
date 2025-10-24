import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchetypeHomeAppComponent } from './archetype-home-app.component';

describe('ArchetypeHomeAppComponent', () => {
  let component: ArchetypeHomeAppComponent;
  let fixture: ComponentFixture<ArchetypeHomeAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchetypeHomeAppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchetypeHomeAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
