package com.minePing.BackEnd.controller;

import com.minePing.BackEnd.dto.WorcationDto;
import com.minePing.BackEnd.service.WorcationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/worcations")
@RequiredArgsConstructor
@Validated
public class WorcationController {

    private final WorcationService worcationService;

    /**
     * 워케이션 생성
     */
    @PostMapping
    public ResponseEntity<WorcationDto.Response> create(
            @RequestBody @Valid WorcationDto.Request request
    ) {
        WorcationDto.Response dto = worcationService.create(request);
        return ResponseEntity.created(
                URI.create("/api/worcations/" + dto.getWorcationNo())
        ).body(dto);
    }

    /**
     * 단건 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<WorcationDto.Response> getById(
            @PathVariable("id") Long id
    ) {
        WorcationDto.Response dto = worcationService.getById(id);
        return ResponseEntity.ok(dto);
    }

    /**
     * 전체 목록 조회
     */
    @GetMapping
    public ResponseEntity<List<WorcationDto.Response>> getAll() {
        List<WorcationDto.Response> list = worcationService.getAll();
        return ResponseEntity.ok(list);
    }

    /**
     * 수정
     */
    @PutMapping("/{id}")
    public ResponseEntity<WorcationDto.Response> update(
            @PathVariable("id") Long id,
            @RequestBody @Valid WorcationDto.Request request
    ) {
        WorcationDto.Response dto = worcationService.update(id, request);
        return ResponseEntity.ok(dto);
    }

    /**
     * 삭제
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        worcationService.delete(id);
        return ResponseEntity.noContent().build();
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> e67e5ff60868559a54503c0884f51a0c7d541103
