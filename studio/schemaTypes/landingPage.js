import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'landingPage',
  title: 'Landing Page',
  type: 'document',
  fields: [
    defineField({
      name: 'lema',
      title: 'Lema',
      type: 'text',
      description: 'Frase de marca que aparece en la banda verde de la home.',
    }),
  ],
  // Solo permitir editar y publicar — no crear ni borrar (es un singleton)
  __experimental_actions: ['update', 'publish'],
})
