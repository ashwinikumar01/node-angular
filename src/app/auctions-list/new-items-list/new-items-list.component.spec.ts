import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewItemsListComponent } from './new-items-list.component';

describe('NewItemsListComponent', () => {
  let component: NewItemsListComponent;
  let fixture: ComponentFixture<NewItemsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewItemsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewItemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
