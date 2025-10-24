import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchetypeStructureComponent } from './archetype-structure.component';

describe('ArchetypeStructureComponent', () => {
  let component: ArchetypeStructureComponent;
  let fixture: ComponentFixture<ArchetypeStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchetypeStructureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArchetypeStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
