/**
 * Classe abstrata base para as estratégias de liberação de quadros.
 * 
 * Toda nova estratégia de liberação DEVE estender essa classe
 * e implementar o método execute() com sua própria lógica.
 */
export abstract class FrameReleaseStrategy {
  abstract execute(status: {
    first: boolean;
    second: boolean;
    third: boolean;
    fourth: boolean;
  }): {
    current_frame: string | null;
    next_frame: string | null;
    can_paint: boolean;
    completed?: boolean;
  };
}
