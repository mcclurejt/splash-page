import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailObjectComponent } from './email-object.component';

describe('EmailObjectComponent', () => {
  let component: EmailObjectComponent;
  let fixture: ComponentFixture<EmailObjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailObjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
