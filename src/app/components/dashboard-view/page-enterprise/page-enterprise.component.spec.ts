import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageEnterpriseComponent } from './page-enterprise.component';

describe('PageEnterpriseComponent', () => {
  let component: PageEnterpriseComponent;
  let fixture: ComponentFixture<PageEnterpriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageEnterpriseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageEnterpriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
