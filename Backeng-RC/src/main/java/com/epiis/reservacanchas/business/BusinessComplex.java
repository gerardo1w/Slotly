package com.epiis.reservacanchas.business;

import com.epiis.reservacanchas.entity.EntityComplex;
import com.epiis.reservacanchas.repository.RepositoryComplex;
import com.epiis.reservacanchas.dto.request.RequestComplexUpdate;
import com.epiis.reservacanchas.dto.response.ResponseComplexGet;
import com.epiis.reservacanchas.staticdata.EnumComplexStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
public class BusinessComplex {

    private final RepositoryComplex repositoryComplex;

    public BusinessComplex(RepositoryComplex repositoryComplex) {
        this.repositoryComplex = repositoryComplex;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAll(boolean approvedOnly) {
        List<EntityComplex> complexes;
        if (approvedOnly) {
            complexes = repositoryComplex.findByStatus(EnumComplexStatus.APPROVED);
        } else {
            complexes = repositoryComplex.findAll();
        }

        List<Map<String, Object>> list = new ArrayList<>();
        for (EntityComplex c : complexes) {
            if (approvedOnly && Boolean.FALSE.equals(c.getActive())) {
                continue;
            }
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", c.getIdComplex());
            map.put("name", c.getName());
            map.put("address", c.getAddress());
            map.put("district", c.getDistrict());
            map.put("ownerId", c.getOwnerId());
            map.put("status", c.getStatus().name().toLowerCase());
            map.put("phone", c.getPhone());
            map.put("image", c.getImage());
            map.put("rating", c.getRating());
            map.put("reviewsCount", c.getReviewsCount());
            map.put("pitchesCount", c.getPitchesCount());
            map.put("timeRange", c.getTimeRange());
            map.put("active", c.getActive());
            list.add(map);
        }
        return list;
    }

    @Transactional
    public ResponseComplexGet approve(String complexId) {
        ResponseComplexGet response = new ResponseComplexGet();
        Optional<EntityComplex> optionalComplex = repositoryComplex.findById(complexId);

        if (optionalComplex.isEmpty()) {
            response.error();
            response.getListMessage().add("Complejo no encontrado.");
            return response;
        }

        EntityComplex complex = optionalComplex.get();
        complex.setStatus(EnumComplexStatus.APPROVED);
        complex.setUpdatedAt(new Date());
        repositoryComplex.save(complex);

        response.setId(complex.getIdComplex());
        response.setName(complex.getName());
        response.setAddress(complex.getAddress());
        response.setDistrict(complex.getDistrict());
        response.setOwnerId(complex.getOwnerId());
        response.setStatus(complex.getStatus().name().toLowerCase());
        response.setPhone(complex.getPhone());
        response.setImage(complex.getImage());
        response.setRating(complex.getRating());
        response.setReviewsCount(complex.getReviewsCount());
        response.setPitchesCount(complex.getPitchesCount());
        response.setTimeRange(complex.getTimeRange());
        response.setActive(complex.getActive());

        response.success();
        response.getListMessage().add("Complejo aprobado exitosamente.");
        return response;
    }

    @Transactional
    public ResponseComplexGet update(RequestComplexUpdate request) {
        ResponseComplexGet response = new ResponseComplexGet();
        Optional<EntityComplex> optionalComplex = repositoryComplex.findById(request.getId());

        if (optionalComplex.isEmpty()) {
            response.error();
            response.getListMessage().add("Complejo no encontrado.");
            return response;
        }

        EntityComplex complex = optionalComplex.get();
        complex.setName(request.getName());
        complex.setAddress(request.getAddress());
        complex.setDistrict(request.getDistrict());
        complex.setPhone(request.getPhone());
        complex.setImage(request.getImage());
        complex.setTimeRange(request.getTimeRange());
        complex.setActive(request.getActive());
        complex.setUpdatedAt(new Date());
        repositoryComplex.save(complex);

        response.setId(complex.getIdComplex());
        response.setName(complex.getName());
        response.setAddress(complex.getAddress());
        response.setDistrict(complex.getDistrict());
        response.setOwnerId(complex.getOwnerId());
        response.setStatus(complex.getStatus().name().toLowerCase());
        response.setPhone(complex.getPhone());
        response.setImage(complex.getImage());
        response.setRating(complex.getRating());
        response.setReviewsCount(complex.getReviewsCount());
        response.setPitchesCount(complex.getPitchesCount());
        response.setTimeRange(complex.getTimeRange());
        response.setActive(complex.getActive());

        response.success();
        response.getListMessage().add("Complejo actualizado exitosamente.");
        return response;
    }
}
