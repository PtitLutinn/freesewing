import { Chevron } from 'shared/components/navigation/primary.js'
import ClearIcon from 'shared/components/icons/clear.js'
import { Ul, Li, Details, Summary, SumDiv, Deg } from 'shared/components/workbench/menu'
import Path from './path.js'
import Point from './point.js'

const types = {
  paths: Path,
  points: Point
}

const XrayList = props => {

  let title = props.app.t(`parts.${props.partName}`)
  if (title !== props.partName || true) title + ` (${props.partName})`

  return (
    <Li>
      <Details>
        <Summary>
          <SumDiv>
            <Deg />
            <span>{title}</span>
            <span className="ml-2 opacity-60">[{props.partName}]</span>
          </SumDiv>
          <button
            className="text-accent px-3 hover:text-secondary-focus"
            onClick={() => props.unsetGist(['xray', 'parts', props.partName])}
          >
            <ClearIcon />
          </button>
          <Chevron w={6} m={3}/>
        </Summary>
        {Object.keys(types).map(type => props.gist.xray.parts[props.partName][type] && (
          <Ul>
            <Li>
              <Details>
                <Summary>
                  <SumDiv>
                    <span className="capitalize">{type}</span>
                  </SumDiv>
                </Summary>
                {Object.keys(props.gist.xray.parts[props.partName][type])
                  .map(id => (
                    <Li>
                      <Details>
                        <Summary>
                          <SumDiv>
                            <Deg />
                            <span>{id}</span>
                          </SumDiv>
                          <Chevron />
                        </Summary>
                        {types[type]({...props, id})}
                      </Details>
                    </Li>
                  ))
                }
              </Details>
            </Li>
          </Ul>
        ))}
      </Details>
    </Li>
  )
}

export default XrayList
