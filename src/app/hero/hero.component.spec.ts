import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HeroComponent } from './hero.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('HeroComponent (shallow tests)', () => {
    //wraper for component has a few other propertied than the component just has
    let fixture: ComponentFixture<HeroComponent>;
    beforeEach(() => {
        //module created specifically for  app.module
        TestBed.configureTestingModule({
            declarations: [HeroComponent],
            schemas: [NO_ERRORS_SCHEMA] // if you encounter unknown attribute or unknow element igore them
        });
        //once the testing module is creted, we can create our component
        //using TestBed.createComponent(HeroComponent);
        fixture = TestBed.createComponent(HeroComponent);

        //access properties hero or delete property using fixture.componentInstance
        // fixture.componentInstance.delete
    });

    it('should have the correct hero', () => {
        fixture.componentInstance.hero = { id: 1, name: 'SuperDude', strength: 3 };
        expect(fixture.componentInstance.hero.name).toBe('SuperDude');
    });

    it('should render the hero name in an anchor tag', () => {
        fixture.componentInstance.hero = { id: 1, name: 'SuperDude', strength: 3 };

        //to detect change the html after setting the property 
        fixture.detectChanges();

        //it is like the native element,it is the way to access to root element of our template
        const deA = fixture.debugElement.query(By.css('a'));
        expect(deA.nativeElement.textContent).toContain('SuperDude');

        //nativeElement property gets a handle to the DOM Element that represent the container for template 
        // expect(fixture.nativeElement.querySelector('a').textContent).toContain('SuperDude');
    });
});
