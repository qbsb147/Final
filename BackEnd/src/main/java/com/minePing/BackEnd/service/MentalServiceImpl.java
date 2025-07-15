package com.minePing.BackEnd.service;

import com.minePing.BackEnd.auth.JwtTokenProvider;
import com.minePing.BackEnd.dto.MemberDto;
import com.minePing.BackEnd.dto.MentalDto;
import com.minePing.BackEnd.dto.MentalDto.Response;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.entity.MemberPreference;
import com.minePing.BackEnd.entity.Mental;
import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.enums.MentalEnums;
import com.minePing.BackEnd.exception.UserNotFoundException;
import com.minePing.BackEnd.repository.MemberRepository;
import com.minePing.BackEnd.repository.MentalRepository;
import jakarta.transaction.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class MentalServiceImpl implements MentalService {

    private final MentalRepository mentalRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final ChatModel chatModel;
    private final MemberRepository memberRepository;

    @Value("classpath:/prompts/survey-stress.st")
    private Resource surveyStress;

    @Value("classpath:/prompts/survey-burnout.st")
    private Resource surveyBurnout;


    @Override
    public List<Response> getMental() {
        String user_id = jwtTokenProvider.getUserIdFromToken();
        List<Mental> mentalList= mentalRepository.getMental(user_id);
        return mentalList.stream()
            .map(MentalDto.Response::fromEntity)
            .collect(Collectors.toList());
    }

    @Override
    public void saveStress(MentalDto.StressRequest stressDto) {
        ChatClient chatClient = ChatClient.builder(chatModel).build();

        Mental mental = chatClient.prompt()
                .user(userSpec -> userSpec.text(surveyStress)
                        .param("answer1", stressDto.getStress1())
                        .param("answer2", stressDto.getStress2())
                        .param("answer3", stressDto.getStress3())
                        .param("answer4", stressDto.getStress4())
                        .param("answer5", stressDto.getStress5())
                        .param("answer6", stressDto.getStress6())
                        .param("answer7", stressDto.getStress7())
                        .param("answer8", stressDto.getStress8())
                        .param("answer9", stressDto.getStress9())
                        .param("answer10", stressDto.getStress10())
                        .param("answer11", stressDto.getStress11())
                        .param("answer12", stressDto.getStress12())
                        .param("answer13", stressDto.getStress13())
                        .param("answer14", stressDto.getStress14())
                        .param("answer15", stressDto.getStress15())
                        .param("format","json"))
                .call()
                .entity(new ParameterizedTypeReference<Mental>() {});

        String userId = jwtTokenProvider.getUserIdFromToken();
        Member member = memberRepository.findByUserIdAndStatus(userId, CommonEnums.Status.Y)
                .orElseThrow(() -> new UserNotFoundException(userId));
        mental.changeMemberAndSeparation(member, MentalEnums.Separation.STRESS);
        mentalRepository.save(mental);
    }

    @Override
    public void saveBurnout(MentalDto.BurnoutRequest burnoutDto) {
        ChatClient chatClient = ChatClient.builder(chatModel).build();

        Mental mental = chatClient.prompt()
                .user(userSpec -> userSpec.text(surveyBurnout)
                        .param("answer1", burnoutDto.getBurnout1())
                        .param("answer2", burnoutDto.getBurnout2())
                        .param("answer3", burnoutDto.getBurnout3())
                        .param("answer4", burnoutDto.getBurnout4())
                        .param("answer5", burnoutDto.getBurnout5())
                        .param("answer6", burnoutDto.getBurnout6())
                        .param("answer7", burnoutDto.getBurnout7())
                        .param("answer8", burnoutDto.getBurnout8())
                        .param("answer9", burnoutDto.getBurnout9())
                        .param("answer10", burnoutDto.getBurnout10())
                        .param("format","json"))
                .call()
                .entity(new ParameterizedTypeReference<Mental>() {});

        String userId = jwtTokenProvider.getUserIdFromToken();
        Member member = memberRepository.findByUserIdAndStatus(userId, CommonEnums.Status.Y)
                .orElseThrow(() -> new UserNotFoundException(userId));
        mental.changeMemberAndSeparation(member, MentalEnums.Separation.BURNOUT);
        mentalRepository.save(mental);
    }
}