import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchetypeHomeComponent } from './archetype-home.component';

describe('ArchetypeHomeComponent', () => {
  let component: ArchetypeHomeComponent;
  let fixture: ComponentFixture<ArchetypeHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchetypeHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchetypeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
