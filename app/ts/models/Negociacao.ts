export class Negociacao {

    /*private _data: Date;
    private _quantidade: number;
    private _valor: number;

    constructor(data: Date, quantidade: number, valor: number) {
        this._data = data;
        this._quantidade = quantidade;
        this._valor = valor;
    }*/

    //sugar sintax for above code

    constructor(readonly data: Date, readonly quantidade: number, readonly valor: number) {}
    
    get volume(){
        return this.quantidade * this.valor;
    }

}