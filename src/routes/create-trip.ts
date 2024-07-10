import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import dayjs from 'dayjs'
import nodemailer from 'nodemailer'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { getMailClient } from '../lib/mail'


export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/trips',
    {
      schema: {
        body: z.object({
          destination: z.string().min(4),
          starts_at: z.coerce.date(),
          ends_at: z.coerce.date(),
          owner_name: z.string(),
          owner_email: z.string().email(),
          emails_to_invite: z.array(z.string().email())
        }),
      },
    },
    async (req, reply) => {
      const { destination, starts_at, ends_at, owner_name, owner_email, emails_to_invite } = req.body

      if (dayjs(starts_at).isBefore(new Date())) {
        throw new Error('Start date must be in the future')
      }

      if (dayjs(ends_at).isBefore(dayjs(starts_at))) {
        throw new Error('End date must be after start date')
      }

      // Create trip and owner participant
      const trip = await prisma.trip.create({
        data: {
          destination,
          starts_at,
          ends_at,
          participants: {
            createMany: {
              data: [
                {
                  name: owner_name,
                  email: owner_email,
                  is_owner: true,
                  is_confirmed: true,
                },
                ...emails_to_invite.map((email) => ({
                  email,
                }))
              ]
            }
          }
        },
      })

      // Send email
      const mail = await getMailClient()

      const message = await mail.sendMail({
        from: {
          name: 'Equipe plann.er',
          address: 'oi@plann.er',
        },
        to: {
          name: owner_name,
          address: owner_email,
        },
        subject: 'Sua viagem no plann.er',
        html: `
          <p>Ola ${owner_name},</p>
          <p>Voce acabou de criar uma nova viagem no plann.er.</p>
          <p>Seu destino: ${destination}</p>
          <p>Seu horário de partida: ${dayjs(starts_at).format('DD/MM/YYYY HH:mm')}</p>
          <p>Seu horário de termino: ${dayjs(ends_at).format('DD/MM/YYYY HH:mm')}</p>
          <p>Seja bem vindo ao plann.er!</p>
        `,
      })

      console.log(nodemailer.getTestMessageUrl(message))

      return reply.send({ tripId: trip.id })
    },
  )
}
