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
