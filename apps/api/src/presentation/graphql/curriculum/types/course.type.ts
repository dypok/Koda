import { Field, ObjectType, Int } from '@nestjs/graphql';
import { TrackType } from './track.type';

@ObjectType('CourseTopology')
export class CourseTopologyType {
  @Field(() => Int)
  tier: number;

  @Field(() => Int)
  lane: number;
}

@ObjectType('CourseEdge')
export class CourseEdgeType {
  @Field(() => String)
  targetCourseSlug: string;

  @Field(() => String)
  connectionType: string;

  @Field(() => String)
  visualEffectCode: string;

  @Field(() => String)
  edgeColor: string;
}

@ObjectType('Course')
export class CourseType {
  @Field(() => String)
  slug: string;

  @Field(() => String)
  trackSlug: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  color: string;

  @Field(() => String)
  icon: string;

  @Field(() => CourseTopologyType)
  topology: CourseTopologyType;

  @Field(() => [String])
  prerequisites: string[];

  @Field(() => [CourseEdgeType])
  edges: CourseEdgeType[];

  @Field(() => Boolean)
  isActive: boolean;
}

@ObjectType('TrackCourses')
export class TrackCoursesType {
  @Field(() => TrackType)
  track: TrackType;

  @Field(() => [CourseType])
  courses: CourseType[];
}

@ObjectType('SectionSummary')
export class SectionSummaryType {
  @Field(() => String)
  slug: string;

  @Field(() => String)
  moduleSlug: string;

  @Field(() => String)
  title: string;

  @Field(() => Int)
  position: number;

  @Field(() => Int)
  totalLessons: number;

  @Field(() => Int)
  xpReward: number;

  @Field(() => Boolean)
  isActive: boolean;
}

@ObjectType('Module')
export class ModuleType {
  @Field(() => String)
  slug: string;

  @Field(() => String)
  courseSlug: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  objective: string;

  @Field(() => Int)
  position: number;

  @Field(() => Int)
  totalSections: number;

  @Field(() => Int)
  minStarsPercentage: number;

  @Field(() => Boolean)
  isActive: boolean;
}

@ObjectType('ModuleWithSections')
export class ModuleWithSectionsType {
  @Field(() => ModuleType)
  module: ModuleType;

  @Field(() => [SectionSummaryType])
  sections: SectionSummaryType[];
}

@ObjectType('CourseDetail')
export class CourseDetailType {
  @Field(() => CourseType)
  course: CourseType;

  @Field(() => [ModuleWithSectionsType])
  modules: ModuleWithSectionsType[];
}
