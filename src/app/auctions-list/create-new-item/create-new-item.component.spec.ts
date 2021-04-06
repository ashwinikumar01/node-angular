import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewItemComponent } from './create-new-item.component';

describe('CreateNewItemComponent', () => {
  let component: CreateNewItemComponent;
  let fixture: ComponentFixture<CreateNewItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
