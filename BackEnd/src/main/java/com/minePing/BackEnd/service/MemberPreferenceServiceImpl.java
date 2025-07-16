package com.minePing.BackEnd.service;

import com.minePing.BackEnd.auth.JwtTokenProvider;
import com.minePing.BackEnd.dto.MemberPreferenceDto;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.entity.MemberPreference;
import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.enums.CommonEnums.Status;
import com.minePing.BackEnd.exception.UserNotFoundException;
import com.minePing.BackEnd.repository.MemberPreferenceRepository;
import com.minePing.BackEnd.repository.MemberRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.ChatClientRequest;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberPreferenceServiceImpl implements MemberPreferenceService{

    private final MemberPreferenceRepository memberPreferenceRepository;
    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final ChatModel chatModel;

    @Override
    @Transactional
    public void savePreference(MemberPreferenceDto.Request requestDto) {
        String userId = jwtTokenProvider.getUserIdFromToken();

        String template = """
This information comes from users' responses to a survey form about their preferred workplace characteristics. After checking the following, write a post analyzing the user's preferences.

Preferred color: {preferred_color},
Preferred location: {preferred_location},
Preferred space mood: {space_mood},
Important factor: {important_factor},
Favorite leisure activity: {leisure_activity},
Preferred accommodation type: {accommodation_type}

Answer within 170 characters in Korean (512 bytes or less)

Translated with DeepL.com (free version)
                """;

        PromptTemplate promptTemplate = new PromptTemplate(template);
        Prompt prompt = promptTemplate.create(Map.of(
                "preferred_color", requestDto.getPreferred_color(),
                "preferred_location", requestDto.getPreferred_location(),
                "space_mood", requestDto.getSpace_mood(),
                "important_factor", requestDto.getImportant_factor(),
                "leisure_activity", requestDto.getLeisure_activity(),
                "accommodation_type", requestDto.getAccommodation_type()
        ));

        ChatClient chatClient = ChatClient.builder(chatModel)
                .build();
        String result_content = chatClient.prompt(prompt)
                .call()
                .content();
        requestDto.setResult_content(result_content);

        Member member = memberRepository.findByUserIdAndStatus(userId, Status.Y)
                .orElseThrow(() -> new UserNotFoundException());

        MemberPreference memberPreference = memberPreferenceRepository.findByMember(member)
                        .orElse(requestDto.toEntity());

        if(memberPreference.getMember() == null) {
            memberPreference.changeMember(member);
        }else{
            memberPreference.updateThis(requestDto);
        }
    }
}
