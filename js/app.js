$(document).ready(function () {
    var problema = {
        "A": ["B", "D", "E"],
        "B": ["A", "C", "F"],
        "C": ["B", "D", "F", "G"],
        "D": ["A", "C", "E", "G"],
        "E": ["A", "D", "G"],
        "F": ["B", "C", "G", "H"],
        "G": ["C", "D", "E", "F"],
        "H": ["F"]
    };

    $('#btnBuscar').on('click', function (e) {
        var estadoInicial = $('#EstadoInicial').val();
        var estadoFinal = $('#EstadoFinal').val();

        if (estadoInicial == '') {
            alert('Debe seleccionar el estado inicial');
            return;
        }

        if (estadoFinal == '') {
            alert('Debe seleccionar el estado meta');
            return;
        }

        $('#Resultado').val('');
        var resultado = '';

        var cerrados = BusquedaAmplitud(estadoInicial, estadoFinal);
        var orden = GetOrden(cerrados);
        resultado += 'Orden de visita segun primero en amplitud: \n';
        resultado += orden + '\n\n';

        cerrados = BusquedaProfundidad(estadoInicial, estadoFinal)
        var camino = GetCamino(estadoInicial, cerrados);
        resultado += 'Camino segun primero en profundidad: \n';
        resultado += camino;

        $('#Resultado').val(resultado);
    });

    function BusquedaAmplitud(ini, meta) {
        var abiertos = [{ "nombre": ini, "padre": ini }];
        var cerrados = [];
        var listo = false;

        while (!listo) {
            var res = SigueAmplitud(abiertos);
            if (res.actual.nombre == meta) {
                listo = true;
                cerrados.push(res.actual);
            } else {
                abiertos = Expandir(res.actual.nombre, abiertos, cerrados);
                cerrados.push(res.actual);
            }
        }
        return cerrados;
    }

    function BusquedaProfundidad(ini, meta) {
        var abiertos = [{ "nombre": ini, "padre": ini }];
        var cerrados = [];
        var listo = false;

        while (!listo) {
            var res = SigueProfundidad(abiertos);
            if (res.actual.nombre == meta) {
                listo = true;
                cerrados.push(res.actual);
            } else {
                abiertos = Expandir(res.actual.nombre, abiertos, cerrados);
                cerrados.push(res.actual);
            }
        }
        return cerrados;
    }

    function Miembro(edo, lista) {
        var resp = false;
        $.each(lista, function (i, nodo) {
            if (nodo.nombre == edo) {
                resp = true;
            }
        });
        return resp;
    }

    function GetHijos(edo) {
        return problema[edo];
    }

    function Expandir(edo, abiertos, cerrados) {
        var hijos = GetHijos(edo);
        $.each(hijos, function (i, hijo) {
            if (!Miembro(hijo, abiertos) && !Miembro(hijo, cerrados)) {
                abiertos.push({ "nombre": hijo, "padre": edo });
            }
        });
        return abiertos;
    }

    function SigueAmplitud(abiertos) {
        var resp = abiertos[0];
        abiertos.splice(0);
        return {"abiertos":abiertos, "actual": resp};
    }

    function SigueProfundidad(abiertos) {
        var resp = abiertos[abiertos.length - 1];
        abiertos.splice(abiertos.length - 1);
        return {"abiertos":abiertos, "actual": resp};
    }

    function GetOrden(cerrados) {
        var resp = [];
        $.each(cerrados, function (i, nodo) {
            resp.push(nodo.nombre);
        });
        return resp;
    }

    function GetCamino(ini, cerrados) {
        var resp = [];
        var edo = cerrados[cerrados.length - 1].nombre;
        var listo = false;
        while (!listo) {
            if (edo == ini) {
                listo = true;
                resp.unshift(edo);
            } else {
                $.each(cerrados, function (i, nodo) {
                    if (nodo.nombre == edo) {
                        resp.unshift(nodo.nombre);
                        edo = nodo.padre;
                    }
                });
            }
        }
        return resp;
    }
});