import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePhotosComponent } from './delete-photos.component';

describe('DeletePhotoComponent', () => {
  let component: DeletePhotosComponent;
  let fixture: ComponentFixture<DeletePhotosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletePhotosComponent]
    });
    fixture = TestBed.createComponent(DeletePhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
