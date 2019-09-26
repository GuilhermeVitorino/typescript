export abstract class View<T> {

    private _elemento: JQuery;

    constructor(seletor: string) {

        this._elemento = $(seletor);
    }

    update(model: T) {

        this._elemento.innerHTML = this.template(model);
    }

    abstract template(model: T): string;

}