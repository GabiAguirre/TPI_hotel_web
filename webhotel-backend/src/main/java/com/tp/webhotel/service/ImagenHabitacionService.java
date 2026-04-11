package com.tp.webhotel.service;

import com.tp.webhotel.model.ImagenHabitacion;
import com.tp.webhotel.model.TipoHabitacion;
import com.tp.webhotel.repository.ImagenHabitacionRepository;
import com.tp.webhotel.util.ImagenUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ImagenHabitacionService {

    @Autowired
    private ImagenHabitacionRepository imagenHabitacionRepository;

    public String subirImagen(MultipartFile archivo, TipoHabitacion id_tipo_habitacion) throws IOException {
        ImagenHabitacion imagenModel = ImagenHabitacion.builder()
                .nombre(archivo.getOriginalFilename())
                .tipo(archivo.getContentType())
                .imagenData(ImagenUtils.compressImage(archivo.getBytes()))
                .tipoHabitacion(id_tipo_habitacion)
                .build();
        imagenHabitacionRepository.save(imagenModel);
        if (imagenModel != null) {
            return "Archivo subido correctamente: " + archivo.getOriginalFilename();
        }
        return "El archivo no se pudo subir";
    }

    public List<byte[]> descargarImagenes(TipoHabitacion id_tipo_habitacion) {
        List<byte[]> imagenes = new ArrayList<>();
        List<ImagenHabitacion> imagenesHabitacion = imagenHabitacionRepository.findByTipoHabitacion(id_tipo_habitacion);
        for (ImagenHabitacion imagenHabitacion : imagenesHabitacion) {
            byte[] imagen = ImagenUtils.decompressImage(imagenHabitacion.getImagenData());
            imagenes.add(imagen);
        }
        return imagenes;
    }
}
