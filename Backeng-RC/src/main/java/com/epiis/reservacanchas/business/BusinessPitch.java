package com.epiis.reservacanchas.business;

import com.epiis.reservacanchas.entity.EntityPitch;
import com.epiis.reservacanchas.entity.EntityComplex;
import com.epiis.reservacanchas.repository.RepositoryPitch;
import com.epiis.reservacanchas.repository.RepositoryComplex;
import com.epiis.reservacanchas.dto.request.RequestPitchInsert;
import com.epiis.reservacanchas.dto.request.RequestPitchUpdate;
import com.epiis.reservacanchas.dto.response.ResponsePitchGet;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
public class BusinessPitch {

    private final RepositoryPitch repositoryPitch;
    private final RepositoryComplex repositoryComplex;

    public BusinessPitch(RepositoryPitch repositoryPitch, RepositoryComplex repositoryComplex) {
        this.repositoryPitch = repositoryPitch;
        this.repositoryComplex = repositoryComplex;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAll(String complexId) {
        List<EntityPitch> pitches;
        if (complexId != null && !complexId.isEmpty()) {
            pitches = repositoryPitch.findByComplexId(complexId);
        } else {
            pitches = repositoryPitch.findAll();
        }

        List<Map<String, Object>> list = new ArrayList<>();
        for (EntityPitch p : pitches) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", p.getIdPitch());
            map.put("complexId", p.getComplexId());
            map.put("name", p.getName());
            map.put("sport", p.getSport());
            map.put("pricePerHour", p.getPricePerHour());
            map.put("image", p.getImage());
            map.put("active", p.getActive());
            list.add(map);
        }
        return list;
    }

    @Transactional
    public ResponsePitchGet insert(RequestPitchInsert request) {
        ResponsePitchGet response = new ResponsePitchGet();

        Optional<EntityComplex> optionalComplex = repositoryComplex.findById(request.getComplexId());
        if (optionalComplex.isEmpty()) {
            response.error();
            response.getListMessage().add("Complejo no encontrado.");
            return response;
        }

        EntityPitch pitch = new EntityPitch();
        pitch.setIdPitch(UUID.randomUUID().toString());
        pitch.setComplexId(request.getComplexId());
        pitch.setName(request.getName());
        pitch.setSport(request.getSport());
        pitch.setPricePerHour(request.getPricePerHour());
        pitch.setImage(request.getImage() != null && !request.getImage().isEmpty() ? request.getImage() : "assets/images/default-pitch.jpg");
        pitch.setActive(request.getActive());
        pitch.setCreatedAt(new Date());
        pitch.setUpdatedAt(new Date());

        repositoryPitch.save(pitch);

        EntityComplex complex = optionalComplex.get();
        complex.setPitchesCount((complex.getPitchesCount() == null ? 0 : complex.getPitchesCount()) + 1);
        complex.setUpdatedAt(new Date());
        repositoryComplex.save(complex);

        response.setId(pitch.getIdPitch());
        response.setComplexId(pitch.getComplexId());
        response.setName(pitch.getName());
        response.setSport(pitch.getSport());
        response.setPricePerHour(pitch.getPricePerHour());
        response.setImage(pitch.getImage());
        response.setActive(pitch.getActive());

        response.success();
        response.getListMessage().add("Cancha registrada exitosamente.");
        return response;
    }

    @Transactional
    public ResponsePitchGet update(RequestPitchUpdate request) {
        ResponsePitchGet response = new ResponsePitchGet();

        Optional<EntityPitch> optionalPitch = repositoryPitch.findById(request.getId());
        if (optionalPitch.isEmpty()) {
            response.error();
            response.getListMessage().add("Cancha no encontrada.");
            return response;
        }

        EntityPitch pitch = optionalPitch.get();
        pitch.setName(request.getName());
        pitch.setSport(request.getSport());
        pitch.setPricePerHour(request.getPricePerHour());
        if (request.getImage() != null) {
            pitch.setImage(request.getImage());
        }
        pitch.setActive(request.getActive());
        pitch.setUpdatedAt(new Date());

        repositoryPitch.save(pitch);

        response.setId(pitch.getIdPitch());
        response.setComplexId(pitch.getComplexId());
        response.setName(pitch.getName());
        response.setSport(pitch.getSport());
        response.setPricePerHour(pitch.getPricePerHour());
        response.setImage(pitch.getImage());
        response.setActive(pitch.getActive());

        response.success();
        response.getListMessage().add("Cancha actualizada exitosamente.");
        return response;
    }

    @Transactional
    public ResponsePitchGet delete(String pitchId) {
        ResponsePitchGet response = new ResponsePitchGet();

        Optional<EntityPitch> optionalPitch = repositoryPitch.findById(pitchId);
        if (optionalPitch.isEmpty()) {
            response.error();
            response.getListMessage().add("Cancha no encontrada.");
            return response;
        }

        EntityPitch pitch = optionalPitch.get();
        repositoryPitch.delete(pitch);

        Optional<EntityComplex> optionalComplex = repositoryComplex.findById(pitch.getComplexId());
        if (optionalComplex.isPresent()) {
            EntityComplex complex = optionalComplex.get();
            int currentCount = complex.getPitchesCount() == null ? 0 : complex.getPitchesCount();
            complex.setPitchesCount(Math.max(0, currentCount - 1));
            complex.setUpdatedAt(new Date());
            repositoryComplex.save(complex);
        }

        response.setId(pitch.getIdPitch());
        response.setComplexId(pitch.getComplexId());
        response.setName(pitch.getName());
        response.setSport(pitch.getSport());
        response.setPricePerHour(pitch.getPricePerHour());
        response.setImage(pitch.getImage());
        response.setActive(pitch.getActive());

        response.success();
        response.getListMessage().add("Cancha eliminada exitosamente.");
        return response;
    }
}
