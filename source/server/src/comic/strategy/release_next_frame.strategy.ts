import { FrameReleaseStrategy } from './frame_release.strategy';

/**
 * Estratégia concreta que decide qual é o PRÓXIMO QUADRO a ser liberado
 * dentro de uma mesma tirinha, com base no status atual de leitura do usuário.
 *
 * Regra de liberação:
 *  - Se o quadro anterior for `true` e o próximo for `false` → libera o próximo quadro.
 *  - Se todos forem `true` → tirinha completada, não há mais quadros a liberar.
 *  - Se todos forem `false` → ainda não começou, libera o primeiro quadro.
 */

//  estratégia concreta/ lógica
export class ReleaseNextFrameStrategy extends FrameReleaseStrategy {
  execute(status: {
    first: boolean;
    second: boolean;
    third: boolean;
    fourth: boolean;
  }) {
    const { first, second, third, fourth } = status;

    // Caso: nenhum quadro foi pintado ainda → libera o primeiro
    if (!first && !second && !third && !fourth) {
      return {
        current_frame: null,
        next_frame: 'first',
        can_paint: true,
      };
    }

    // Caso: first feito, second ainda não → libera o second
    if (first && !second) {
      return {
        current_frame: 'first',
        next_frame: 'second',
        can_paint: true,
      };
    }

    // Caso: second feito, third ainda não → libera o third
    if (second && !third) {
      return {
        current_frame: 'second',
        next_frame: 'third',
        can_paint: true,
      };
    }

    // Caso: third feito, fourth ainda não → libera o fourth
    if (third && !fourth) {
      return {
        current_frame: 'third',
        next_frame: 'fourth',
        can_paint: true,
      };
    }

    // Caso: todos os quadros foram concluídos → tirinha completa
    if (first && second && third && fourth) {
      return {
        current_frame: 'fourth',
        next_frame: null,
        can_paint: false,
        completed: true,
      };
    }

    // Caso padrão de segurança: estado inválido/inesperado
    return {
      current_frame: null,
      next_frame: null,
      can_paint: false,
    };
  }
}
