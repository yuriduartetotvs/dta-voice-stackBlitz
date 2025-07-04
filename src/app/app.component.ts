import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PoButtonModule, PoFieldModule, PoTableModule, PoNotificationModule, PoNotificationService, PoTableColumn, PoDividerModule, PoWidgetModule } from '@po-ui/ng-components';
import { DtaVoiceComponent, JsonReturnAiModel, AudioJsonModel } from 'dta-voice';
import { MedicamentosModel, Root } from './models';
import { environment } from './enviroments';

@Component({
  selector: 'app-root',
  imports: [
    PoButtonModule,
    PoFieldModule,
    ReactiveFormsModule,
    PoWidgetModule,
    PoDividerModule,
    PoTableModule,
    PoNotificationModule,
    DtaVoiceComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  //Json estruturado que será retornado para a LLM, para auxiliar na construção da resposta.
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

  //variáveis para o DTA Voice
  context = "Medicamentos do paciente";
  idProjeto = environment.idProjeto;
  idDtaVoice = environment.idDtaVoice;
  user = environment.user;
  contingency = environment.contingency;
  sliderNewVoiceOpen=false;

  //Método que será chamado pelo DTA Voice para receber as informações processadas e retornada em JSON
  receberInformacao(informacao: { menssagem: JsonReturnAiModel; uniqueKey: number; }) {


    //Preenchendo o campo de texto com a resposta da LLM, através do json estruturado.
    if (informacao.menssagem.responseMessage) {
      this.processDocument(informacao.menssagem.responseMessage);
    } else {
      console.error('Invalid response format:', informacao.menssagem.responseMessage);
    }
    console.log('Received information:', informacao);
  }




  //---------------------------Apenas o exemplo para preencher os dados do LLM no formulario-----------------
  private processDocument(inf: string) {
    console.log('Input string:', inf);

    try {
      let cleanedJson = inf.trim();

      if (cleanedJson.startsWith('"') && cleanedJson.endsWith('"')) {
        cleanedJson = JSON.parse(cleanedJson);
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

  pacienteForm!: FormGroup;
  medicamentoForm!: FormGroup;
  medicamentos: MedicamentosModel[] = [];
  @ViewChild('sliderNewVoice')
  private readonly sliderNewVoice?: DtaVoiceComponent;


  medicamentosColumns: PoTableColumn[] = [
    { property: 'medication_name', label: 'Medicamento' },
    { property: 'dosage', label: 'Dosagem' },
    { property: 'frequency', label: 'Frequência' }
  ];

  frequenciaOptions = [
    { value: 'Diário', label: 'Diário' },
    { value: '12h/12h', label: '12h/12h' },
    { value: '8h/8h', label: '8h/8h' },
    { value: '6h/6h', label: '6h/6h' },
    { value: 'Conforme necessário', label: 'Conforme necessário' }
  ];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly poNotification: PoNotificationService
  ) { }

  ngOnInit(): void {
    this.inicializarFormularios();
  }

  inicializarFormularios(): void {
    this.pacienteForm = this.formBuilder.group({
      nomePaciente: ['', Validators.required],
      idadePaciente: [null, [Validators.required, Validators.min(0), Validators.max(120)]]
    });

    this.medicamentoForm = this.formBuilder.group({
      nomeMedicamento: ['', Validators.required],
      dosagem: ['', Validators.required],
      frequencia: ['', Validators.required]
    });
  }

  adicionarMedicamento(): void {
    if (this.medicamentoForm?.valid) {
      const novoMedicamento = this.medicamentoForm.value as MedicamentosModel;
      this.medicamentos.push(novoMedicamento);
      this.medicamentoForm.reset();
      this.poNotification.success('Medicamento adicionado com sucesso!');
    }
  }

  resetarFormulario(): void {
    if (this.pacienteForm) this.pacienteForm.reset();
    if (this.medicamentoForm) this.medicamentoForm.reset();
    this.medicamentos = [];
  }

  openNewVoice() {
    this.sliderNewVoiceOpen = true;
    this.sliderNewVoice?.openNewVoice();
  }
}
