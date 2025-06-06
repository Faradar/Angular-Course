import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Course } from '../../../../../models';

export const CoursesActions = createActionGroup({
  source: 'Courses',
  events: {
    // Load all courses
    'Load Courses': emptyProps(),
    'Load Courses Success': props<{ courses: Course[] }>(),
    'Load Courses Failure': props<{ error: string }>(),

    // Create a new course
    'Create Course': props<{ course: Omit<Course, 'id'> }>(),
    'Create Course Success': props<{ course: Course }>(),
    'Create Course Failure': props<{ error: string }>(),

    // Update an existing course
    'Update Course': props<{ course: Course }>(),
    'Update Course Success': props<{ course: Course }>(),
    'Update Course Failure': props<{ error: string }>(),

    // Delete a course
    'Delete Course': props<{ id: string }>(),
    'Delete Course Success': props<{ id: string }>(),
    'Delete Course Failure': props<{ error: string }>(),
  },
});
