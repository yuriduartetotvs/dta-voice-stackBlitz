```md
# DTA VOICE

Biblioteca para facilitar a extração de texto através de audios.

## Como instalar

```bash
npm install dta-voice --save
```

ou

```bash
yarn add dta-voice --save
```

## Como usar

É necessário possuir um código de projeto para uso. Após obtenção do código do projeto, basta seguir os passos abaixo.

### Uso no HTML

```html
    <po-button 
        p-label="Carregar dados para pagina"
        p-icon="po-icon-ok"
        p-kind="primary"
        (p-click)="openNewVoice()">
    </po-button>

  <dta-voice 
    labelHeader="Nome que vai aparece no cabeçalho do slider como subtitle"
    [context]="context"
    [jsonReturn]="jsonReturn" 
    [idDtaVoice]="idDtaVoice"
    [idProjeto]="idProjeto"
    [user]="user"
    [contingency]="contingency"
    (informacaoEnviada)="receberInformacao({ menssagem
    : $event.message, uniqueKey: $event.uniqueKey})" 
    #sliderNewVoice>
  </dta-voice>
```

### Para TypeScript

```typescript
jsonReturn: AudioJsonModel[] = [
    {
      fieldName: 'medications',
      fieldType: 'array',
      fieldDescription: 'Medicamentos do paciente',
      isRequired: true,
      subFields: [
        {
          fieldName: 'medication_name',
          fieldType: 'string',
          fieldDescription: 'Nome do medicamento',
          isRequired: true
        },
        {
          fieldName: 'dosage',
          fieldType: 'string',
          fieldDescription: 'Dosagem',
          isRequired: true
        },
        {
          fieldName: 'frequency',
          fieldType: 'string',
          fieldDescription: 'Frequência',
          isRequired: true
        }
      ]
    },
    {
      fieldName: 'patient_name',
      fieldType: 'string',
      fieldDescription: 'Nome do paciente',
      isRequired: true
    },
    {
      fieldName: 'patient_age',
      fieldType: 'number',
      fieldDescription: 'Idade do paciente',
      isRequired: true
    }
  ];

  context = ""; //Informação que vai de contexto para llm, por exemplo medicina
  idProjeto = "";
  idDtaVoice = "";
  user = "";
  contingency = '';

  @ViewChild('sliderNewVoice')
  private readonly sliderNewVoice?: DtaVoiceComponent;

  openNewVoice() {
    this.sliderNewVoice?.openNewVoice();
  }
```
## Para facilitar a criação do Json acima

~~~url
https://html-teste-pi.vercel.app/
~~~

  
```typescript
receberInformacao(informacao: { menssagem: JsonReturnAiModel; uniqueKey: number; }) {
    // informacao.menssagem.forEach((item) => {

    // });
    if (informacao.menssagem.responseMessage) {
      this.processDocument(informacao.menssagem.responseMessage);
    } else {
      console.error('Invalid response format:', informacao.menssagem.responseMessage);
    }
    console.log('Received information:', informacao);
}

private processDocument(inf: string) {
    console.log('Input string:', inf);

    try {
      let cleanedJson = inf.trim();

      if (cleanedJson.startsWith('"') && cleanedJson.endsWith('"')) {
        cleanedJson = JSON.parse(cleanedJson); // This will unescape the JSON string
      }

      const json = JSON.parse(cleanedJson) as Root;
      console.log('Parsed JSON:', json);

      if (json && json.patient_name && Array.isArray(json.medications)) {
        this.pacienteForm.patchValue({
          nomePaciente: json.patient_name
        });

        this.pacienteForm.patchValue({
          idadePaciente: json.patient_age
        });

        this.medicamentos = json.medications;
      } else {
        console.error('Invalid JSON structure:', json);
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      console.error('Failed to parse:', inf);
    }
}
```

## Explicação do buttonList
  - `fieldName`: Nome do campo.
  - `fieldType`: Tipo de dado esperado.
  - `fieldDescription`: Descrição do campo.
  - `isRequired`: Se o campo é obrigatório
  


## Dados experados no exemplo

~~~ typescript
export interface Root {
    patient_name: string
    patient_age: number
    medications: MedicamentosModel[]
}

export interface MedicamentosModel {
    medication_name: string
    dosage: string
    frequency: string
}
~~~

### (Opcional) Habilitar o Tour

Caso queira usar o tour de demostração de como usar aplicação Angular, siga os passos abaixo:

Coloque a variável `enableTour` como `true` no componente e, depois, siga as etapas abaixo.

~~~html
  <dta-voice 
  [enableTour]="'true'"
    .
    .
    .
  >
  </dta-voice>
~~~

#### 1. Instale a biblioteca

É necessário instalar a biblioteca `angular-shepherd`:

```bash
npm i angular-shepherd
```

#### 2. Inclua as dependências de estilo
No arquivo angular.json, adicione o Shepherd CSS na seção de estilos:

~~~ javascript
"styles": [
  "node_modules/shepherd.js/dist/css/shepherd.css"
]
~~~

Observação: Certifique-se de que o caminho está correto para o seu projeto e que a linha do Shepherd CSS foi realmente adicionada.

Referências:
- [Angular Shepherd NPM](https://www.npmjs.com/package/angular-shepherd)
- [Shepherd.js](https://shepherdjs.dev/)