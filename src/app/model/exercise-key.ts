export class ExerciseKey {

  constructor(
    public seriesId: number,
    public exerciseId: number
  ) { }

  get exercisePath() {
    return this.seriesId + '/' + this.exerciseId + '/exercise'
  };

  get solutionPath() {
    return this.seriesId + '/' + this.exerciseId + '/solution'
  };


  static from(path: string) {
    if (!path) {
      return null;
    }
    const fragments = path.split('/');
    if (fragments.length !== 3) {
      return null;
    }
    const seriesId = parseInt(fragments[0], 10);
    const exerciseId = parseInt(fragments[1], 10);
    if (isNaN(seriesId) || isNaN(exerciseId)) {
      return null;
    }
    return new ExerciseKey(seriesId, exerciseId);
  }

}