package com.minePing.BackEnd.service;

import com.minePing.BackEnd.auth.JwtTokenProvider;
import com.minePing.BackEnd.dto.MemberPreferenceDto;
import com.minePing.BackEnd.dto.MentalDto;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.entity.MemberPreference;
import com.minePing.BackEnd.entity.Mental;
import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.enums.CommonEnums.Status;
import com.minePing.BackEnd.enums.MentalEnums;
import com.minePing.BackEnd.enums.MentalEnums.Separation;
import com.minePing.BackEnd.exception.UserNotFoundException;
import com.minePing.BackEnd.repository.MemberPreferenceRepository;
import com.minePing.BackEnd.repository.MemberRepository;
import com.minePing.BackEnd.repository.MentalRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MentalServiceImpl implements MentalService {

    private final MentalRepository mentalRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final ChatModel chatModel;
    private final MemberRepository memberRepository;
    private final MemberPreferenceRepository memberPreferenceRepository;

    @Value("classpath:/prompts/survey-stress.st")
    private Resource surveyStress;

    @Value("classpath:/prompts/survey-burnout.st")
    private Resource surveyBurnout;


    @Override
    @Transactional
    public void saveStress(MentalDto.StressRequest stressDto) {

        Integer score = stressDto.getScore();

        MentalEnums.PsychologicalState psychologicalState = stressDto.getPsychologicalState(score);

        String userId = jwtTokenProvider.getUserIdFromToken();
        Member member = memberRepository.findByUserIdAndStatus(userId, CommonEnums.Status.Y)
                .orElseThrow(() -> new UserNotFoundException(userId));

        ChatClient chatClient = ChatClient.builder(chatModel).build();

        String result_content = chatClient.prompt()
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
                        .param("score", score)
                        .param("psychologicalState", psychologicalState)
                )
                .call()
                .content();

        Mental mental = Mental.builder()
                .score(score)
                .psychologicalState(psychologicalState)
                .separation(Separation.STRESS)
                .member(member)
                .resultContent(result_content)
                .build();


        Mental prevMental = mentalRepository.findByMemberAndSeparation(member, MentalEnums.Separation.STRESS);

        if(prevMental != null) {
            prevMental.changeThis(mental);
        }else {
            mentalRepository.save(mental);
        }
    }

    @Override
    @Transactional
    public void saveBurnout(MentalDto.BurnoutRequest burnoutDto) {

        Integer score = burnoutDto.getScore();

        MentalEnums.PsychologicalState psychologicalState = burnoutDto.getPsychologicalState(score);

        String userId = jwtTokenProvider.getUserIdFromToken();
        Member member = memberRepository.findByUserIdAndStatus(userId, CommonEnums.Status.Y)
                .orElseThrow(() -> new UserNotFoundException(userId));

        ChatClient chatClient = ChatClient.builder(chatModel).build();

        String result_content = chatClient.prompt()
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
                        .param("score", score)
                        .param("psychologicalState", psychologicalState)
                )
                .call()
                .content();

        Mental mental = Mental.builder()
                .score(score)
                .psychologicalState(psychologicalState)
                .separation(Separation.BURNOUT)
                .member(member)
                .resultContent(result_content)
                .build();

        Mental prevMental = mentalRepository.findByMemberAndSeparation(member, MentalEnums.Separation.BURNOUT);

        if(prevMental != null) {
            prevMental.changeThis(mental);
        }else {
            mentalRepository.save(mental);
        }
    }

    @Override
    public MentalDto.MentalsResponse findMentals() {
        String user_id = jwtTokenProvider.getUserIdFromToken();
        Member member = memberRepository.findByUserIdAndStatus(user_id, Status.Y)
                .orElseThrow(() -> new UserNotFoundException());
        Mental stress = mentalRepository.findByMemberAndSeparation(member, MentalEnums.Separation.STRESS);
        Mental burnout = mentalRepository.findByMemberAndSeparation(member, MentalEnums.Separation.BURNOUT);
        MemberPreference memberPreference = memberPreferenceRepository.findByMember(member)
                .orElse(null);

        MentalDto.MentalsResponse mentalsResponse = new MentalDto.MentalsResponse();

        MentalDto.Response stressDto;
        MentalDto.Response burnoutDto;
        MemberPreferenceDto.Result preferenceDto;

        if(stress != null) {
            stressDto = MentalDto.Response.toDto(stress);
            mentalsResponse.setStress(stressDto);
        }
        if(burnout != null) {
            burnoutDto = MentalDto.Response.toDto(burnout);
            mentalsResponse.setBurnout(burnoutDto);
        }
        if(memberPreference!=null) {
            preferenceDto = MemberPreferenceDto.Result.toDto(memberPreference);
            mentalsResponse.setPreference(preferenceDto);
        }

        return mentalsResponse;
    }

    @Override
    public MentalDto.MainResponse findMainMental() {
        String user_id = jwtTokenProvider.getUserIdFromToken();
        Member member = memberRepository.findByUserIdAndStatus(user_id, Status.Y)
                .orElseThrow(() -> new UserNotFoundException());
        Mental stress = mentalRepository.findByMemberAndSeparation(member, MentalEnums.Separation.STRESS);
        Mental burnout = mentalRepository.findByMemberAndSeparation(member, MentalEnums.Separation.BURNOUT);

        MentalDto.MainResponse mainResponse = new MentalDto.MainResponse();

        MentalDto.Main stressDto = MentalDto.Main.toDto(stress);
        MentalDto.Main burnoutDto = MentalDto.Main.toDto(burnout);

        mainResponse.setStress(stressDto);
        mainResponse.setBurnout(burnoutDto);
        return mainResponse;
    }
}