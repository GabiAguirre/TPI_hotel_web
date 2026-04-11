package com.tp.webhotel.service;

import com.tp.webhotel.model.Estadia;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void enviarConfirmacion(Estadia estadia) {
        if (mailSender == null) return;
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(estadia.getUsuario().getEmail());
            message.setSubject("Confirmación de reserva #" + estadia.getIdEstadia() + " - Hotel");
            message.setText(buildEmailBody(estadia));
            mailSender.send(message);
        } catch (Exception e) {
            // No interrumpir el flujo si el mail falla
        }
    }

    private String buildEmailBody(Estadia estadia) {
        long noches = (estadia.getFechaEgreso().getTime() - estadia.getFechaIngreso().getTime())
                / (1000L * 60 * 60 * 24);

        String servicios = estadia.getServicios() == null || estadia.getServicios().isEmpty()
                ? "Ninguno"
                : estadia.getServicios().stream()
                        .map(s -> s.getDenominacion() + " ($" + s.getCosto() + ")")
                        .collect(Collectors.joining(", "));

        return "Estimado/a " + estadia.getUsuario().getNombre() + " " + estadia.getUsuario().getApellido() + ",\n\n"
                + "Su reserva ha sido confirmada exitosamente.\n\n"
                + "Detalles de la reserva:\n"
                + "- N° de reserva:    " + estadia.getIdEstadia() + "\n"
                + "- Habitación N°:    " + estadia.getHabitacion().getNroHabitacion() + "\n"
                + "- Tipo:             " + estadia.getHabitacion().getTipoHabitacion().getDenominacion() + "\n"
                + "- Fecha de ingreso: " + estadia.getFechaIngreso() + "\n"
                + "- Fecha de egreso:  " + estadia.getFechaEgreso() + "\n"
                + "- Noches:           " + noches + "\n"
                + "- Servicios:        " + servicios + "\n"
                + "- Total:            $" + estadia.getPrecioTotal() + "\n\n"
                + "¡Lo esperamos!\n\nHotel Management";
    }
}
