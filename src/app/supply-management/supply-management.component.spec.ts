import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyManagementComponent } from './supply-management.component';

describe('SupplyManagementComponent', () => {
  let component: SupplyManagementComponent;
  let fixture: ComponentFixture<SupplyManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupplyManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplyManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
