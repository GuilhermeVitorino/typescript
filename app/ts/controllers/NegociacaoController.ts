//barrel strategy
import { NegociacoesView, MensagemView } from '../views/index';
import { Negociacoes, Negociacao, NegociacaoParcial } from '../models/index';
import { DomInject, logarTempoDeExecucao, Throttle } from '../helpers/decorators/index';
import { NegociacaoService } from '../services/index';
import { imprime } from '../helpers/Utils';

export class NegociacaoController {

  @DomInject('#data')
  private _inputData: JQuery;

  @DomInject('#quantidade')
  private _inputQuantidade: JQuery;

  @DomInject('#valor')
  private _inputValor: JQuery;

  private _negociacoes = new Negociacoes();
  private _negociacoesView = new NegociacoesView('#negociacoesView');
  private _mensagemView = new MensagemView('#mensagemView');

  private _negociacaoService = new NegociacaoService();

  constructor() {
    this._negociacoesView.update(this._negociacoes);
  }


  @Throttle()
  adiciona(): void {

    let data = new Date(this._inputData.val().replace(/-/g, ','));

    if (!this._ehDiaUtil(data)) {

      this._mensagemView.update('Somente negociações em dias úteis, por favor!');
      return
    }

    const negociacao = new Negociacao(
      data,
      parseInt(this._inputQuantidade.val()),
      parseFloat(this._inputValor.val())
    );

    this._negociacoes.adiciona(negociacao);

    this._negociacoes.paraArray().forEach(negociacao => {
      console.log(negociacao.data);
      console.log(negociacao.quantidade);
      console.log(negociacao.valor);
    });

    this._negociacoesView.update(this._negociacoes);
    this._mensagemView.update('Negociação adicionada com sucesso');
    
    imprime(negociacao, this._negociacoes);

  }

  private _ehDiaUtil(data: Date) {

    return data.getDay() != DiaDaSemana.Sabado && data.getDay() != DiaDaSemana.Domingo;
  }

  @Throttle()
  importaDados() {

    function isOk(res: Response) {

      if (res.ok) {
        return res;
      } else {
        throw new Error(res.statusText);
      }
    }

    this._negociacaoService
      .obterNegociacoes(isOk)
      .then(negociacoesParaImportar => {

        const negociacoesJaImportadas = this._negociacoes.paraArray();

        negociacoesParaImportar.filter(negociacao => 
          !negociacoesJaImportadas.some(
            jaImportada => negociacao.ehIgual(jaImportada)))
        .forEach(negociacao => this._negociacoes.adiciona(negociacao));
        
        this._negociacoesView.update(this._negociacoes);

      });
  }

}

enum DiaDaSemana {

  Domingo,
  Segunda,
  Terca,
  Quarta,
  Quinta,
  Sexta,
  Sabado
}