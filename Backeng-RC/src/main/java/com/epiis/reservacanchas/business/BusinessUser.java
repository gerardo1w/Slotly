package com.epiis.reservacanchas.business;

import com.epiis.reservacanchas.entity.EntityUser;
import com.epiis.reservacanchas.entity.EntityComplex;
import com.epiis.reservacanchas.repository.RepositoryUser;
import com.epiis.reservacanchas.repository.RepositoryComplex;
import com.epiis.reservacanchas.dto.request.RequestUserLogin;
import com.epiis.reservacanchas.dto.request.RequestUserRegister;
import com.epiis.reservacanchas.dto.response.ResponseUserGet;
import com.epiis.reservacanchas.staticdata.EnumUserRole;
import com.epiis.reservacanchas.staticdata.EnumSubscriptionType;
import com.epiis.reservacanchas.staticdata.EnumComplexStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
public class BusinessUser {

    private final RepositoryUser repositoryUser;
    private final RepositoryComplex repositoryComplex;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public BusinessUser(RepositoryUser repositoryUser, RepositoryComplex repositoryComplex) {
        this.repositoryUser = repositoryUser;
        this.repositoryComplex = repositoryComplex;
    }

    @Transactional
    public ResponseUserGet register(RequestUserRegister request) {
        ResponseUserGet response = new ResponseUserGet();
        try {
            Optional<EntityUser> existingUser = repositoryUser.findByEmail(request.getEmail());
            EntityUser user;
            if (existingUser.isPresent()) {
                response.error();
                response.getListMessage().add("El correo electrónico ya se encuentra registrado.");
                return response;
            }

            user = new EntityUser();
            user.setIdUser(UUID.randomUUID().toString());
            user.setEmail(request.getEmail());
            user.setName(request.getName());
            user.setRole(EnumUserRole.valueOf(request.getRole().toUpperCase()));
            user.setSubscription(EnumSubscriptionType.FREE);
            user.setBlocked(false);
            user.setCreatedAt(new Date());
            user.setUpdatedAt(new Date());
            user.setPassword(passwordEncoder.encode(request.getPassword()));

            if (user.getRole() == EnumUserRole.OWNER && request.getComplexData() != null) {
                EntityComplex complex = new EntityComplex();
                complex.setIdComplex(UUID.randomUUID().toString());
                complex.setName(request.getComplexData().getName());
                complex.setAddress(request.getComplexData().getAddress());
                complex.setDistrict(request.getComplexData().getDistrict());
                complex.setPhone(request.getComplexData().getPhone());
                complex.setOwnerId(user.getIdUser());
                complex.setStatus(EnumComplexStatus.APPROVED);
                complex.setActive(true);
                complex.setRating(4.5);
                complex.setReviewsCount(0);
                complex.setPitchesCount(0);
                complex.setTimeRange("08:00 am - 10:00 pm");
                complex.setCreatedAt(new Date());
                complex.setUpdatedAt(new Date());

                try {
                    repositoryComplex.save(complex);
                    user.setComplexId(complex.getIdComplex());
                } catch (Exception ex) {
                    response.error();
                    response.getListMessage().add("Error al crear el complejo asociado: " + ex.getMessage());
                    return response;
                }
            }

            EntityUser savedUser;
            try {
                savedUser = repositoryUser.save(user);
            } catch (Exception ex) {
                response.error();
                response.getListMessage().add("Error al guardar usuario en la base de datos: " + ex.getMessage());
                return response;
            }

            response.setId(savedUser.getIdUser());
            response.setEmail(savedUser.getEmail());
            response.setName(savedUser.getName());
            response.setRole(savedUser.getRole().name().toLowerCase());
            response.setSubscription(savedUser.getSubscription().name().toLowerCase());
            response.setComplexId(savedUser.getComplexId());
            response.setBlocked(savedUser.getBlocked());

            response.success();
            response.getListMessage().add("Usuario registrado exitosamente.");
            return response;
        } catch (Exception e) {
            response.error();
            response.getListMessage().add("Error inesperado al procesar el registro: " + e.getMessage());
            return response;
        }
    }

    @Transactional(readOnly = true)
    public ResponseUserGet login(RequestUserLogin request) {
        ResponseUserGet response = new ResponseUserGet();
        Optional<EntityUser> optionalUser = repositoryUser.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            response.error();
            response.getListMessage().add("Credenciales incorrectas o usuario no encontrado.");
            return response;
        }

        EntityUser user = optionalUser.get();
        if (Boolean.TRUE.equals(user.getBlocked())) {
            response.error();
            response.getListMessage().add("Este usuario ha sido bloqueado por el administrador.");
            return response;
        }

        if (user.getPassword() == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            response.error();
            response.getListMessage().add("Credenciales incorrectas o usuario no encontrado.");
            return response;
        }

        response.setId(user.getIdUser());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setRole(user.getRole().name().toLowerCase());
        response.setSubscription(user.getSubscription().name().toLowerCase());
        response.setComplexId(user.getComplexId());
        response.setBlocked(user.getBlocked());
        response.success();
        return response;
    }

    @Transactional
    public ResponseUserGet subscribeToPro(String userId) {
        ResponseUserGet response = new ResponseUserGet();
        Optional<EntityUser> optionalUser = repositoryUser.findById(userId);

        if (optionalUser.isEmpty()) {
            response.error();
            response.getListMessage().add("Usuario no encontrado.");
            return response;
        }

        EntityUser user = optionalUser.get();
        user.setSubscription(EnumSubscriptionType.PRO);
        user.setUpdatedAt(new Date());
        repositoryUser.save(user);

        response.setId(user.getIdUser());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setRole(user.getRole().name().toLowerCase());
        response.setSubscription(user.getSubscription().name().toLowerCase());
        response.setComplexId(user.getComplexId());
        response.setBlocked(user.getBlocked());

        response.success();
        response.getListMessage().add("Suscripción PRO activada exitosamente.");
        return response;
    }

    @Transactional
    public ResponseUserGet toggleBlock(String userId) {
        ResponseUserGet response = new ResponseUserGet();
        Optional<EntityUser> optionalUser = repositoryUser.findById(userId);

        if (optionalUser.isEmpty()) {
            response.error();
            response.getListMessage().add("Usuario no encontrado.");
            return response;
        }

        EntityUser user = optionalUser.get();
        boolean newBlockedState = user.getBlocked() == null || !user.getBlocked();
        user.setBlocked(newBlockedState);
        user.setUpdatedAt(new Date());
        repositoryUser.save(user);

        response.setId(user.getIdUser());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setRole(user.getRole().name().toLowerCase());
        response.setSubscription(user.getSubscription().name().toLowerCase());
        response.setComplexId(user.getComplexId());
        response.setBlocked(user.getBlocked());

        response.success();
        response.getListMessage().add("Estado de bloqueo del usuario actualizado.");
        return response;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAll() {
        List<EntityUser> users = repositoryUser.findAll();
        List<Map<String, Object>> list = new ArrayList<>();
        for (EntityUser user : users) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", user.getIdUser());
            map.put("email", user.getEmail());
            map.put("name", user.getName());
            map.put("role", user.getRole().name().toLowerCase());
            map.put("subscription", user.getSubscription().name().toLowerCase());
            map.put("complexId", user.getComplexId());
            map.put("blocked", user.getBlocked());
            list.add(map);
        }
        return list;
    }
}
